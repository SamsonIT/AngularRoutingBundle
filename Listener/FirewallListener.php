<?php

namespace Samson\Bundle\AngularRoutingBundle\Listener;

use Samson\Bundle\AngularRoutingBundle\Firewall\FirewallMap;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Security\Http\Firewall;

class FirewallListener {
    private $map;
    private $listener;
    public function __construct(FirewallMap $map, ResponseHeaderListener $listener)
    {
        $this->map = $map;
        $this->listener = $listener;
    }
    public function onKernelRequest(GetResponseEvent $e)
    {
        if (!$e->getRequest()->headers->has('X-Request-URI')) {
            return;
        }

        $firewallName = $this->map->getMapName($e->getRequest());

        if ($e->getRequestType() == Kernel::MASTER_REQUEST) {
            $this->listener->addHeader('X-Response-URI', $e->getRequest()->getRequestUri());
            $this->listener->addHeader('X-Firewall', $firewallName);
        }

        if ($e->getRequest()->isXmlHttpRequest() && $e->getRequest()->headers->get('X-Firewall') && $firewallName != $e->getRequest()->headers->get('X-Firewall')) {
            $response = new Response('', 204, array('X-View-Refresh' => $e->getRequest()->getRequestUri()));
            $e->setResponse($response);
        }
    }
}