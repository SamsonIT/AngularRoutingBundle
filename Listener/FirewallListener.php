<?php

namespace Samson\Bundle\AngularRoutingBundle\Listener;

use Samson\Bundle\SecurityBundle\Firewall\FirewallMap;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Security\Core\SecurityContext;
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
        $firewallName = $this->map->getMapName($e->getRequest());

        $this->listener->addHeader('X-Response-URI', $e->getRequest()->getRequestUri());

        if ($e->getRequest()->isXmlHttpRequest() && $e->getRequest()->headers->get('X-Firewall') && $firewallName != $e->getRequest()->headers->get('X-Firewall')) {
            $response = new Response('', 204, array('X-View-Refresh' => $e->getRequest()->getRequestUri()));
            $e->setResponse($response);
        }

        $this->listener->addHeader('X-Firewall', $firewallName);
    }
}