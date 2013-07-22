<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Samson\Bundle\AngularRoutingBundle\Firewall;

use Symfony\Bundle\SecurityBundle\Security\FirewallMap as BaseFirewallMap;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * This is a lazy-loading firewall map implementation
 *
 * Listeners will only be initialized if we really need them.
 *
 * @author Johannes M. Schmitt <schmittjoh@gmail.com>
 */
class FirewallMap extends BaseFirewallMap
{
    public function getMapName(Request $request)
    {
        foreach ($this->map as $contextId => $requestMatcher) {
            if (null === $requestMatcher || $requestMatcher->matches($request)) {
                return substr($contextId, 30);
            }
        }

        return null;
    }
}
